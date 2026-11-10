<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\SaveUserRequest;
use App\Models\User;
use App\Support\Permissions;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use ApiResponse;
    private function account(User $user): array {
        return ['id'=>$user->id,'name'=>$user->name,'email'=>$user->email,'nip'=>$user->nip,
            'role'=>$user->role->value,'status'=>$user->status->value,
            'permissions'=>$user->effectivePermissions(),'created_at'=>$user->created_at?->toISOString()];
    }
    public function index(Request $request) {
        $filters=$request->validate(['search'=>['nullable','string','max:255'],'role'=>['nullable','in:admin,employee'],
            'status'=>['nullable','in:active,inactive'],'page'=>['nullable','integer','min:1'],'per_page'=>['nullable','integer','min:1','max:100']]);
        $query=User::query()->when($filters['search'] ?? null, fn ($q,$term) => $q->where(fn ($q) => $q->where('name','like',"%$term%")->orWhere('email','like',"%$term%")))
            ->when($filters['role'] ?? null, fn ($q,$role) => $q->where('role',$role))
            ->when($filters['status'] ?? null, fn ($q,$status) => $q->where('status',$status));
        $users=$query->orderByDesc('id')->paginate($filters['per_page'] ?? 10);
        $users->setCollection($users->getCollection()->map(fn ($user) => $this->account($user)));
        return $this->paginatedResponse($users,'Daftar user berhasil dimuat.');
    }
    public function permissions() {
        return $this->successResponse(collect(Permissions::LABELS)->map(fn ($label,$key) => ['key'=>$key,'label'=>$label])->values());
    }
    public function show(User $user) { return $this->successResponse($this->account($user)); }
    public function store(SaveUserRequest $request) {
        $data=$request->validated();
        $data['password']=Hash::make($data['password']);
        $data['permissions']=$data['role']==='admin' ? $data['permissions'] : [];
        $user=User::create($data);
        return $this->createdResponse($this->account($user),'User berhasil ditambahkan.');
    }
    public function update(SaveUserRequest $request, User $user) {
        $data=$request->validated();
        $updated=DB::transaction(function () use ($request,$user,$data) {
            // Serialize account-access changes, including concurrent manager demotions.
            $accounts=User::orderBy('id')->lockForUpdate()->get();
            $target=$accounts->firstWhere('id',$user->id);
            abort_unless($target,404);
            $data['permissions']=$data['role']==='admin' ? $data['permissions'] : [];
            if ($target->id === $request->user()->id && ($data['role']!=='admin' || $data['status']!=='active' || !in_array('users.manage',$data['permissions'],true))) {
                throw ValidationException::withMessages(['role'=>'Anda tidak dapat menonaktifkan atau mencabut akses manajemen user akun sendiri.']);
            }
            if (!empty($data['password'])) $data['password']=Hash::make($data['password']);
            else unset($data['password']);
            $target->fill($data);
            $hasManager=$accounts->contains(fn ($account) => $account->status->value==='active' && $account->hasPermission('users.manage'));
            if (!$hasManager) throw ValidationException::withMessages(['permissions'=>'Harus ada minimal satu admin aktif dengan permission manajemen user.']);
            $sensitive=$target->isDirty(['password','email','role','status','permissions']);
            $target->save();
            if ($sensitive) $target->tokens()->delete();
            return $target;
        });
        return $this->successResponse($this->account($updated),'User diperbarui. Perubahan akses atau password mengakhiri sesi login lama.');
    }
}

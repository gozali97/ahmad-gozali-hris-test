<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\Gender;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'nip'         => fake()->unique()->numerify('EMP####'),
            'name'        => fake()->name(),
            'email'       => fake()->unique()->safeEmail(),
            'password'    => Hash::make('password'),
            'phone'       => fake()->phoneNumber(),
            'address'     => fake()->address(),
            'birth_date'  => fake()->dateTimeBetween('-45 years', '-22 years'),
            'gender'      => fake()->randomElement([Gender::Male, Gender::Female]),
            'join_date'   => fake()->dateTimeBetween('-5 years', 'now'),
            'status'      => UserStatus::Active,
            'leave_quota' => 12,
            'role'        => UserRole::Employee,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'nip'  => 'ADM0001',
            'name' => 'Admin HR',
            'email' => 'admin@hrsystem.com',
            'role' => UserRole::Admin,
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

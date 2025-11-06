<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // 定义权限门
        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });

        Gate::define('group-owner', function ($user, $group) {
            return $group->owner_id === $user->id;
        });

        Gate::define('group-admin', function ($user, $group) {
            $member = $group->members()->where('user_id', $user->id)->first();
            return $member && $member->role >= 1;
        });

        Gate::define('group-member', function ($user, $group) {
            return $group->members()->where('user_id', $user->id)->exists();
        });

        Gate::define('manage-post', function ($user, $post) {
            return $post->user_id === $user->id || 
                   $user->role === 'admin' ||
                   $post->group->members()->where('user_id', $user->id)->where('role', '>=', 1)->exists();
        });
    }
}
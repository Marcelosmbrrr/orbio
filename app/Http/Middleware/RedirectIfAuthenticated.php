<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                if (Auth::user()->role->id === 1 || Auth::user()->role->id === 2) {
                    return redirect('/home/users');
                } else if (Auth::user()->role === 3) {
                    return redirect('/home/service-orders');
                } else if (Auth::user()->role === 4) {
                    return redirect('/home/reports');
                }
            }
        }

        return $next($request);
    }
}

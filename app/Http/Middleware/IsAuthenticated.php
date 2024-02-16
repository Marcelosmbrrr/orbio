<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!getAuth()->check()) {
            return redirect("/signin");
        }

        return $next($request);
    }
}

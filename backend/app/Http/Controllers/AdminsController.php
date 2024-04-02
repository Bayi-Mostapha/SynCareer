<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->tokenCan('super-admin')) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        $admins = Admin::all();
        return response()->json(compact('admins'));
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->tokenCan('super-admin')) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        $validated_data = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|unique:admins,email',
            'password' => 'required',
        ]);
        $validated_data['password'] = Hash::make($validated_data['password']);
        $validated_data['role'] = 'a';

        Admin::create($validated_data);
        return response()->json(['message' => 'Admin created successfully']);
    }

    public function destroy(Request $request, Admin $admin)
    {
        $user = $request->user();
        if (!$user->tokenCan('super-admin')) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        $admin->delete();
        return response()->json(['message' => 'Admin deleted successfully']);
    }
}

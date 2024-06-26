<?php

namespace App\Http\Controllers;

use Dompdf\Dompdf;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ResumeController extends Controller
{
    function show(Resume $resume)
    {
        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        $filePath = storage_path('app/resumes/' . $resume->resume_name);
        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        return response()->file($filePath);
    }

    function index(Request $request)
    {
        $resumes = $request->user()->resumes;
        return response()->json($resumes);
    }

    function store(Request $request)
    {
        $user = $request->user();
        if (!$user->tokenCan('user')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validatedData = $request->validate([
            'html_content' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        try {
            $dompdf = new Dompdf();
            $dompdf->loadHtml($validatedData['html_content']);
            $dompdf->setPaper('A4');
            $dompdf->set_option('defaultFont', 'sans-serif');
            $dompdf->render();
            $pdfContent = $dompdf->output();
            $fileName = 'resume_' . uniqid() . '.pdf';
            $filePath = 'resumes/' . $fileName;
            Storage::put($filePath, $pdfContent);
        } catch (\Exception $e) {
            Log::error('An error occurred in dompdf: ' . $e->getMessage());
        }

        $image = $request->file('image');
        $imageName = 'image_' . uniqid() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('resume-images', $imageName);

        Resume::create([
            'user_id' => $request->user()->id,
            'resume_name' => $fileName,
            'image_name' => $imageName,
        ]);

        return response()->json([
            'message' => 'Resume saved successfully',
            'fileName' => $fileName
        ]);
    }

    function upload(Request $request)
    {
        $user = $request->user();
        if (!$user->tokenCan('user')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'resume' => 'required|mimes:pdf',
            'image' => 'required|image'
        ]);

        try {
            $file = $request->file('resume');
            $fileName = 'resume_' . uniqid() . '.pdf';
            $file->storeAs('resumes', $fileName);

            $image = $request->file('image');
            $imageName = 'image_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('resume-images', $imageName);

            Resume::create([
                'user_id' => $request->user()->id,
                'resume_name' => $fileName,
                'image_name' => $imageName
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error uploading your file',
            ], 422);
        }

        return response()->json([
            'message' => 'Resume uploaded successfully',
        ]);
    }

    function download(Request $request, $filename)
    {
        $user = $request->user();
        $resume = Resume::where('user_id', $user->id)
            ->where('resume_name', $filename)
            ->first();
        if (!$resume) {
            abort(404);
        }

        $filePath = storage_path('app/resumes/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }
        return response()->download($filePath, $filename);
    }

    function downloadById(Resume $resume)
    {
        $filePath = storage_path('app/resumes/' . $resume->resume_name);
        if (!file_exists($filePath)) {
            abort(404);
        }
        return response()->download($filePath, $resume->resume_name);
    }

    function deleteResume(Request $request, Resume $resume)
    {
        $user = $request->user();
        if (!$user->tokenCan('user')) {
            return response()->json(["message" => 'This action is forbidden'], 403);
        }
        $this->authorize('delete', $resume);

        Storage::delete(['resume-images/' . $resume->image_name, 'resumes/' . $resume->resume_name]);
        $resume->delete();
        return response()->json(["message" => 'resume deleted successfully']);
    }
}

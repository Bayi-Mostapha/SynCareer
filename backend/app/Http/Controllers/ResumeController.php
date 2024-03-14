<?php

namespace App\Http\Controllers;

use Dompdf\Dompdf;
use App\Models\Resume;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ResumeController extends Controller
{
    function index(Request $request)
    {
        $resumes = $request->user()->resumes;
        return response()->json($resumes);
    }

    function store(Request $request)
    {
        $validatedData = $request->validate([
            'html_content' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        $dompdf = new Dompdf();
        $dompdf->loadHtml($validatedData['html_content']);
        $dompdf->render();
        $pdfContent = $dompdf->output();
        $fileName = 'resume_' . uniqid() . '.pdf';
        $filePath = 'resumes/' . $fileName;
        Storage::put($filePath, $pdfContent);

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

    function deleteResume(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required',
        ]);
        $resume = Resume::findOrFail($validatedData['id']);
        Storage::delete(['resume-images/' . $resume->image_name, 'resumes/' . $resume->resume_name]);
        $resume->delete();
        return response()->json(["message" => 'resume deleted successfully']);
    }
}
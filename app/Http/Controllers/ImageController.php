<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'images' => 'required',
            'image.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'id_appart' => 'required|exists:appartements,id_appart'
        ]);

        $uploadedImages = [];
    
        if($request->hasFile('images')){
        foreach($request->file('images') as $imageFile){
            $path = $imageFile->store('appartements', 'public');

            $image = new Image();
            $image->nom_image = $path;
            $image->id_appart = $request->id_appart;
            $image->save();

            $uploadedImages[] = $image;
        }
    }

    return response()->json([
        'message' => count($uploadedImages) . ' images enregistrées',
        'images' => $uploadedImages
    ]);
}
}
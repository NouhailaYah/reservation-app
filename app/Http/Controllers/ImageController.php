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
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'id_appart' => 'required|exists:appartements,id_appart'
        ]);
    
        // Sauvegarder l’image dans storage/app/public/appartements
        $path = $request->file('image')->store('appartements', 'public');
    
        // Stocker le nom de l’image dans la BDD
        $image = new Image();
        $image->nom_image = $path;
        $image->id_appart = $request->id_appart;
        $image->save();
    
        return response()->json(['message' => 'Image enregistrée', 'image' => $image]);
    }
}


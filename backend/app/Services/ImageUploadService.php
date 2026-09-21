<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageUploadService
{
    /**
     * Store an uploaded image on the 'public' disk and return the relative path.
     * Returns null if no file was provided.
     */
    public static function store(?UploadedFile $file, string $folder): ?string
    {
        if (! $file) {
            return null;
        }

        return $file->store($folder, 'public');
    }

    /**
     * Delete an image by its relative path. Safe to call with null.
     */
    public static function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Build a full public URL from a relative path.
     */
    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return asset('storage/' . $path);
    }
}
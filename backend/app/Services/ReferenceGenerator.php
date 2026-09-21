<?php

namespace App\Services;

use App\Models\Complaint;
use App\Models\LostFoundItem;

class ReferenceGenerator
{
    /**
     * Character set excludes 0/O, 1/I/L to avoid confusion when
     * students read the reference aloud or type it from a screenshot.
     */
    private const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    private const LENGTH = 6;

    /**
     * Generate a unique complaint reference like: CFX-7K42P9
     */
    public static function forComplaint(): string
    {
        return self::generate('CFX-', fn ($ref) => Complaint::where('tracking_reference', $ref)->exists());
    }

    /**
     * Generate a unique Lost & Found reference like: LF-7K42P9
     */
    public static function forLostFound(): string
    {
        return self::generate('LF-', fn ($ref) => LostFoundItem::where('reference_no', $ref)->exists());
    }

    private static function generate(string $prefix, callable $exists): string
    {
        do {
            $ref = $prefix . self::randomString();
        } while ($exists($ref));

        return $ref;
    }

    private static function randomString(): string
    {
        $alphabet = self::ALPHABET;
        $max = strlen($alphabet) - 1;
        $out = '';

        for ($i = 0; $i < self::LENGTH; $i++) {
            $out .= $alphabet[random_int(0, $max)];
        }

        return $out;
    }
}
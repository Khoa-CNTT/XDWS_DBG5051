<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            Schema::table('orders', function (Blueprint $table) {
                // Nếu cột status đã tồn tại, cần xoá hoặc đổi kiểu về enum
                $table->dropColumn('status');
            });

            Schema::table('orders', function (Blueprint $table) {
                // Thêm lại cột status với kiểu enum
                $table->enum('status', ['pending', 'completed', 'canceled'])->default('pending');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('status');
            });

            Schema::table('orders', function (Blueprint $table) {
                $table->string('status')->default('pending');
            });
        });
    }
};

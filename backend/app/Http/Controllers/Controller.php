<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * 成功响应
     */
    protected function success($data = [], $message = 'success', $code = 200)
    {
        return response()->json([
            'code' => $code,
            'message' => $message,
            'data' => $data,
            'timestamp' => time()
        ], $code);
    }

    /**
     * 错误响应
     */
    protected function error($message = 'error', $code = 400, $data = [])
    {
        return response()->json([
            'code' => $code,
            'message' => $message,
            'data' => $data,
            'timestamp' => time()
        ], $code);
    }

    /**
     * 分页响应
     */
    protected function paginate($paginator)
    {
        return response()->json([
            'code' => 200,
            'message' => 'success',
            'data' => [
                'list' => $paginator->items(),
                'pagination' => [
                    'page' => $paginator->currentPage(),
                    'size' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'pages' => $paginator->lastPage()
                ]
            ],
            'timestamp' => time()
        ]);
    }
}
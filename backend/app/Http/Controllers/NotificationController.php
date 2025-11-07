<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * 获取通知列表
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $size = $request->input('size', 20);
        $type = $request->input('type'); // 可选：筛选类型
        $isRead = $request->input('is_read'); // 可选：筛选已读/未读
        
        $query = $request->user()->notifications()->orderBy('created_at', 'desc');
        
        if ($type !== null) {
            $query->where('type', $type);
        }
        
        if ($isRead !== null) {
            $query->where('is_read', $isRead);
        }
        
        $notifications = $query->paginate($size, ['*'], 'page', $page);
        
        return $this->paginate($notifications);
    }
    
    /**
     * 获取未读通知数量
     */
    public function unreadCount(Request $request)
    {
        $count = $request->user()->notifications()
            ->where('is_read', 0)
            ->count();
        
        return $this->success([
            'unread_count' => $count,
        ]);
    }
    
    /**
     * 标记通知为已读
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->find($id);
        
        if (!$notification) {
            return $this->error('通知不存在', 404);
        }
        
        $notification->markAsRead();
        
        return $this->success([], '标记成功');
    }
    
    /**
     * 标记所有通知为已读
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->notifications()
            ->where('is_read', 0)
            ->update(['is_read' => 1]);
        
        return $this->success([], '已标记全部为已读');
    }
    
    /**
     * 删除通知
     */
    public function destroy(Request $request, $id)
    {
        $notification = $request->user()->notifications()->find($id);
        
        if (!$notification) {
            return $this->error('通知不存在', 404);
        }
        
        $notification->delete();
        
        return $this->success([], '删除成功');
    }
    
    /**
     * 清空所有已读通知
     */
    public function clearRead(Request $request)
    {
        $request->user()->notifications()
            ->where('is_read', 1)
            ->delete();
        
        return $this->success([], '已清空所有已读通知');
    }
}

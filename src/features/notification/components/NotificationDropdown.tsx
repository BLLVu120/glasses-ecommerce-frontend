import { useState, memo, useCallback } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useNotificationStream } from "../hooks/useNotificationStream";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const NotificationDropdown = memo(function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useNotificationStream();

  const { notifications, unreadCount, readAll, readSingle, isLoading } = useNotifications();

  const handleItemClick = useCallback((e: React.MouseEvent, id: string, isUnread: boolean) => {
    e.stopPropagation(); // 🌟 CHẶN NỔI BỘT: Không cho event click bay ra ngoài Header
    
    if (isUnread) {
      readSingle(id);
    }
    
    setExpandedId((prevId) => (prevId === id ? null : id));
  }, [readSingle]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        // 🌟 GIỮ DROPDOWN LUÔN MỞ: Ngăn Radix tự đóng khi DOM thay đổi đột ngột
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-sm font-semibold">Thông báo</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                readAll();
              }}
            >
              Đánh dấu đọc tất cả
            </Button>
          )}
        </div>
        
        <Separator />

        <ScrollArea className="h-[400px]">
          {isLoading && notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center p-4 text-sm text-muted-foreground">
              Đang tải thông báo...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center p-4 text-sm text-muted-foreground">
              Không có thông báo mới
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((item) => {
                const isUnread = item.read === false;
                const isExpanded = expandedId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={(e) => handleItemClick(e, item.id, isUnread)}
                    className={`group flex cursor-pointer flex-col gap-1 border-b px-4 py-3 transition-colors duration-300 hover:bg-muted/50 ${
                      isUnread ? "bg-blue-50/40 dark:bg-blue-900/10" : "bg-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          isUnread ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                        }`}
                      >
                        {item.title}
                      </span>
                      
                      <span 
                        className={`mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 shadow-sm transition-opacity duration-300 ${
                          isUnread ? "opacity-100" : "opacity-0"
                        }`} 
                      />
                    </div>
                    
                    <span 
                      className={`text-sm text-muted-foreground ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {item.content}
                    </span>
                    
                    <span className="mt-1 text-xs text-muted-foreground/50">
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}); // 4. Đóng ngoặc memo
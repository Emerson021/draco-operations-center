
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const NotificationBell = () => {
  const {
    notifications,
    markAsRead,
    removeNotification,
    unreadCount,
    loading
  } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-2 hover:bg-draco-gray-700"
          aria-label="Notificações"
        >
          <Bell className="w-6 h-6 text-draco-gold-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1">
              <Badge className="bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-draco-gray-800 border-draco-gray-600 p-0 rounded-lg shadow-lg" align="end">
        <div className="p-3">
          <h4 className="font-semibold text-draco-gold-400 mb-2">Notificações</h4>
          {loading ? (
            <div className="text-draco-gray-400 text-sm py-4 text-center">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="text-draco-gray-400 text-sm py-4 text-center">Nenhuma notificação.</div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-2 px-2 py-2 rounded transition-colors group",
                    !n.lida ? "bg-draco-gray-700" : "bg-transparent"
                  )}
                >
                  <div className="flex-1">
                    <div className="font-medium text-draco-gold-400">{n.titulo}</div>
                    {n.mensagem && (
                      <div className="text-sm text-draco-gray-200">{n.mensagem}</div>
                    )}
                    <div className="text-xs text-draco-gray-400">
                      {new Date(n.created_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  {!n.lida && (
                    <Button
                      onClick={() => markAsRead(n.id)}
                      size="icon"
                      variant="ghost"
                      className="text-green-500 hover:bg-transparent"
                      aria-label="Marcar como lida"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => removeNotification(n.id)}
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:bg-transparent"
                    aria-label="Remover notificação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default NotificationBell;

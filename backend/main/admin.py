from django.contrib import admin
from .models import Task, UserProfile, UserToken
from django.contrib.auth.models import User
from django.utils.html import format_html

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'created_at')
    search_fields = ('title', 'owner__username')
    list_filter = ('created_at',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(owner=request.user)
        return qs

    def has_change_permission(self, request, obj=None):
        if obj and not request.user.is_superuser:
            return obj.owner == request.user
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj and not request.user.is_superuser:
            return obj.owner == request.user
        return super().has_delete_permission(request, obj)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "owner" and not request.user.is_superuser:
            kwargs["queryset"] = User.objects.filter(id=request.user.id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio')
    search_fields = ('user__username', 'bio')

@admin.register(UserToken)
class UserTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__username',)
    readonly_fields = ('access_token', 'refresh_token', 'created_at', 'updated_at')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(user=request.user)
        return qs

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'stored_tokens_display')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active')

    def stored_tokens_display(self, obj):
        try:
            token = obj.stored_tokens
            return format_html(
                '<strong>Access Token:</strong><br>{}<br><br>'
                '<strong>Refresh Token:</strong><br>{}',
                token.access_token,
                token.refresh_token
            )
        except UserToken.DoesNotExist:
            return "Токены не созданы"

    stored_tokens_display.short_description = 'JWT Токены'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
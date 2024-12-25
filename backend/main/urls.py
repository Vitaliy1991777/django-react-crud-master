from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, TaskViewSet, CustomTokenObtainPairView, CustomTokenRefreshView

# Роутер для автоматической генерации маршрутов
router = DefaultRouter()
router.register(r'userprofiles', UserProfileViewSet, basename='userprofile')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),  # Подключение маршрутов роутера
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Эндпоинт для получения токена
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),  # Эндпоинт для обновления токена
]

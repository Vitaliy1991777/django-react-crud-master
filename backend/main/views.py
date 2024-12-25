from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, UserProfile, UserToken
from .serializers import TaskSerializer, UserProfileSerializer
from .permissions import IsOwnerOrReadOnly

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            username = request.data.get('username')
            user = User.objects.filter(username=username).first()

            if not user:
                return Response({"detail": "Пользователь не найден."}, 
                              status=status.HTTP_404_NOT_FOUND)

            refresh = RefreshToken.for_user(user)
            UserToken.objects.update_or_create(
                user=user,
                defaults={
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                }
            )

        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            new_access_token = response.data.get('access')
            refresh_token = request.data.get('refresh')

            if not new_access_token or not refresh_token:
                return Response(
                    {"detail": "Недостаточно данных для обновления токенов."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            UserToken.objects.filter(refresh_token=refresh_token).update(
                access_token=new_access_token
            )
        
        return response

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

from django.urls import path
from .views import dashboard_view, news_detail_view

urlpatterns = [
    path('', dashboard_view, name='dashboard'),
    path('news/<int:index>/', news_detail_view, name='news_detail'),
]
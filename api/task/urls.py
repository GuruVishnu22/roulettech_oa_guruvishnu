from rest_framework import routers
from . import views
from django.urls import path,include
router = routers.DefaultRouter()

router.register(r'categories' , views.CategoryView,basename='category')
router.register(r'tags' , views.TagView,basename='tag')
router.register(r'items' , views.ItemView,basename='item')

urlpatterns = [
    path('', include(router.urls)),
    path('items/add', views.add_item),
    path('items/analytics', views.get_dashboard),
    path('items/filter', views.items_filter),
]

{
    "category_count" : 5,
    "item_count" : 23
}

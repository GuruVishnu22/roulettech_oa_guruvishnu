from django.shortcuts import render
from rest_framework import viewsets,authentication,permissions,response
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from django.db import connection

class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TagView(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ItemView(viewsets.ModelViewSet):
    # get all the items with the tag names which has one or more items
    queryset = Item.objects.all().prefetch_related('tags').all()
    serializer_class = ItemSerializer


global cache
cache = {}

ANALYTICS_KEY = 'analytics'

@api_view(["POST" , "GET"])
def add_item(request):
    """Add item to the database"""

    if request.method == 'POST':
        data = request.data
        if 'category_id' not in data:
            return response.Response({'message':'Category id is required'},status=400)
        if 'category_id' in data and not isinstance(data['category_id'],int):
            return response.Response({'message':'Category id should be an integer'},status=400)
        if 'tags' not in data:
            return response.Response({'message':'Tags are required'},status=400)
        item = Item.objects.create(
            sku = data['sku'],
            name = data['name'],
            category_id = data['category_id'],
            stock = data['stock'],
            available_stock = data['available_stock']
        )
        item.tags.set(data['tags'])
        item.save()
        return response.Response({'message':'Item added successfully'},status=201)
    else:
        return response.Response({'message':'Invalid request'},status=400)

@api_view(["GET"])
def get_dashboard(request):

    if ANALYTICS_KEY in cache:
        return response.Response(cache[ANALYTICS_KEY],status=200)

    """Get the dashboard details"""
    cursor = connection.cursor()
    cursor.execute('''
        SELECT  COUNT(1) as item_count FROM task_item
    ''')
    row = cursor.fetchone()
    item_count = row[0] if row else 0
    cursor.execute('''
        SELECT  COUNT(1) as category_count FROM task_category
    ''')
    row = cursor.fetchone()
    category_count = row[0] if row else 0
    cursor.close()
    data = {
        'category_count':category_count,
        'item_count':item_count,
    }
    cache[ANALYTICS_KEY] = data
    return response.Response(data,status=200)

@api_view(["GET"])
def items_filter(request):
    """Get the items based on the filter"""
    category = request.GET.get('category')
    in_stock = request.GET.get('istock')
    available_stock = request.GET.get('astock')

    # if the request url is in the cache return the data from the cache
    if request.get_full_path() in cache:
        return response.Response(cache[request.get_full_path()],status=200)
    

    items = Item.objects.all()

    if category:
        if category.isdigit():
            items = items.filter(category_id=category)
    if in_stock:
        items = items.filter(stock__lt=in_stock)
    if available_stock:
        items = items.filter(available_stock__lt=available_stock)

    serializer = ItemSerializer(items,many=True)
    cache[request.get_full_path()] = serializer.data
    return response.Response(serializer.data,status=200)
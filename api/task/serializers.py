from rest_framework.serializers import ModelSerializer
from .models import *

class CategorySerializer(ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(ModelSerializer):
    
    class Meta:
        model = Tag
        fields = '__all__'

class ItemSerializer(ModelSerializer):
    tags = TagSerializer(many=True,read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Item
        fields = ('id','sku','name','category','stock','available_stock','tags',)
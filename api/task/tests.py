from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Category, Tag, Item

class ItemsFilterTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        Category.objects.create(name='Electronics')
        Tag.objects.create(name='Mobile')
        Item.objects.create(sku='123', name='Mobile', category_id=1, stock=10, available_stock=5)

    def test_items_filter_with_category(self):
        url = '/api/items/filter?category=1'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data

    def test_items_filter_with_in_stock(self):
        url = '/api/items/filter?istock=10'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data

    def test_items_filter_with_available_stock(self):
        url = '/api/items/filter?astock=5'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data


class AddItemTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        Category.objects.create(name='Electronics')
        Tag.objects.create(name='Mobile')

    def test_add_item(self):
        url = '/api/items/add'
        data = {
            'sku': '123',
            'name': 'Mobile',
            'category_id': 1,
            'stock': 10,
            'available_stock': 5,
            'tags': [1]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Add more assertions to validate the response data

    def test_add_item_invalid_request(self):
        url = '/api/items/add'
        data = {
            'sku': '123',
            'name': 'Mobile',
            'stock': 10,
            'available_stock': 5,
            'tags': [1]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Add more assertions to validate the response data

class AddCategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_add_category(self):
        url = '/api/categories/'
        data = {'name': 'Electronics'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Add more assertions to validate the response data

    def test_add_category_invalid_request(self):
        url = '/api/categories/'
        data = {'name': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Add more assertions to validate the response data


class AddTagTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_add_tag(self):
        url = '/api/tags/'
        data = {'name': 'Mobile'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Add more assertions to validate the response data

    def test_add_tag_invalid_request(self):
        url = '/api/tags/'
        data = {'name': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Add more assertions to validate the response data


class GetDashboardTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        Category.objects.create(name='Electronics')
        Tag.objects.create(name='Mobile')
        Item.objects.create(sku='123', name='Mobile', category_id=1, stock=10, available_stock=5)

    def test_get_dashboard(self):
        url = '/api/items/analytics'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data

    def test_get_dashboard_no_data(self):
        Item.objects.all().delete()
        url = '/api/items/analytics'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data

from rest_framework import viewsets
from app.models.models import Category
from app.categories.serializers.read import CategoryReadSerializer
from app.categories.serializers.write import CategoryWriteSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CategoryReadSerializer
        return CategoryWriteSerializer

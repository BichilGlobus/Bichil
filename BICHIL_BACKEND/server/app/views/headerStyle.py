from rest_framework import viewsets, filters
from app.models.models import HeaderStyle
from app.serializers.headerStyle import HeaderStyleSerializer

class HeaderStyleViewSet(viewsets.ModelViewSet):
    queryset = HeaderStyle.objects.all()
    serializer_class = HeaderStyleSerializer


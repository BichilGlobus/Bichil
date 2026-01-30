from rest_framework import viewsets
from app.models.models import HeaderTertiaryMenu
from app.serializers.headersTertiaryMenu import HeaderTertiaryMenuSerializer

class HeaderTertiaryMenuViewSet(viewsets.ModelViewSet):
    queryset = HeaderTertiaryMenu.objects.all()
    serializer_class = HeaderTertiaryMenuSerializer

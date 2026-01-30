from rest_framework import viewsets, status
from rest_framework.response import Response
from app.models.models import HeaderSubmenu
from app.serializers.headersSubmenu import HeaderSubmenuSerializer

class HeaderSubmenuViewSet(viewsets.ModelViewSet):
    queryset = HeaderSubmenu.objects.all()
    serializer_class = HeaderSubmenuSerializer

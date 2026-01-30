from rest_framework import viewsets
from app.models.models import AppDownloadList
from app.serializers.appDownloadList import AppDownloadListSerializer

class AppDownloadListViewSet(viewsets.ModelViewSet):
    queryset = AppDownloadList.objects.all()
    serializer_class = AppDownloadListSerializer

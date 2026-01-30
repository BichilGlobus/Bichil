from rest_framework import viewsets, status
from rest_framework.response import Response
from app.models.models import Header
from app.serializers.headers import HeaderSerializer, HeaderCreateUpdateSerializer

class HeaderViewSet(viewsets.ModelViewSet):
    queryset = Header.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return HeaderCreateUpdateSerializer
        return HeaderSerializer

    def destroy(self, request, *args, **kwargs):
        header = self.get_object()
        header.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from rest_framework import viewsets
from app.models.models import Footer
from app.serializers.footer import FooterSerializer

class FooterViewSet(viewsets.ModelViewSet):
    queryset = Footer.objects.all()
    serializer_class = FooterSerializer

    def get_queryset(self):
        user = self.request.user
        return Footer.objects.all()  

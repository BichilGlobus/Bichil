from rest_framework import serializers
from app.models.models import Footer, FooterTranslations, Language

class FooterTranslationsSerializer(serializers.ModelSerializer):
    language_id = serializers.PrimaryKeyRelatedField(
        source='language', queryset=Language.objects.all()
    )

    class Meta:
        model = FooterTranslations
        fields = ['id', 'language_id', 'description', 'location', 'copyright']

class FooterSerializer(serializers.ModelSerializer):
    translations = FooterTranslationsSerializer(many=True, write_only=True, required=False)
    translations_read = FooterTranslationsSerializer(
        source='footertranslations_set', many=True, read_only=True
    )

    class Meta:
        model = Footer
        fields = [
            'id', 'logotext', 'facebook', 'instagram', 'twitter',
            'bgcolor', 'fontcolor', 'accentcolor', 'iconcolor',
            'titlesize', 'fontsize', 'translations', 'translations_read'
        ]

    def create(self, validated_data):
        translations_data = validated_data.pop('translations', [])
        footer = Footer.objects.create(**validated_data)

        for t_data in translations_data:
            FooterTranslations.objects.create(footer=footer, **t_data)

        return footer

    def update(self, instance, validated_data):
        translations_data = validated_data.pop('translations', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if translations_data:
            instance.footertranslations_set.all().delete()
            for t_data in translations_data:
                FooterTranslations.objects.create(footer=instance, **t_data)

        return instance

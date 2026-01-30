from rest_framework import serializers
from app.models.models import Cta, CtaTitle, CtaSubtitle

class CtaTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CtaTitle
        fields = ["id", "language", "label"]


class CtaSubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CtaSubtitle
        fields = ["id", "language", "label"]


class CtaSerializer(serializers.ModelSerializer):
    titles = CtaTitleSerializer(
        source="ctatitle_set", many=True
    )
    subtitles = CtaSubtitleSerializer(
        source="ctasubtitle_set", many=True
    )

    class Meta:
        model = Cta
        fields = [
            "id",
            "file",
            "index",
            "font",
            "color",
            "number",
            "titles",
            "subtitles",
        ]

    def create(self, validated_data):
        titles_data = validated_data.pop("ctatitle_set", [])
        subtitles_data = validated_data.pop("ctasubtitle_set", [])

        cta = Cta.objects.create(**validated_data)

        for title in titles_data:
            CtaTitle.objects.create(
                cta=cta,
                language=title["language"],
                label=title["label"],
            )

        for subtitle in subtitles_data:
            CtaSubtitle.objects.create(
                cta=cta,
                language=subtitle["language"],
                label=subtitle["label"],
            )

        return cta

    def update(self, instance, validated_data):
        titles_data = validated_data.pop("ctatitle_set", [])
        subtitles_data = validated_data.pop("ctasubtitle_set", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        CtaTitle.objects.filter(cta=instance).delete()
        CtaSubtitle.objects.filter(cta=instance).delete()

        for title in titles_data:
            CtaTitle.objects.create(
                cta=instance,
                language=title["language"],
                label=title["label"],
            )

        for subtitle in subtitles_data:
            CtaSubtitle.objects.create(
                cta=instance,
                language=subtitle["language"],
                label=subtitle["label"],
            )

        return instance

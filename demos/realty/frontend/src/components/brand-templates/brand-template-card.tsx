import { GenericCard, CanvaIcon, DemoButton } from "src/components";
import { useAppContext } from "src/context";
import type { BrandTemplate } from "@canva/connect-api-ts/types.gen";

type BrandTemplateCardProps = {
  template: BrandTemplate;
  onClick: () => void;
};

export const BrandTemplateCard = ({
  template,
  onClick,
}: BrandTemplateCardProps) => {
  const { isAuthorized } = useAppContext();

  return (
    <GenericCard
      title={template.title}
      alt={template.title}
      subtitle={`Last updated: ${new Date(template.updated_at * 1000).toLocaleDateString()}`}
      images={[template.thumbnail?.url]}
      imageHeight={320}
      className="brand-template-card"
    >
      {isAuthorized && (
        <DemoButton
          demoVariant="primary"
          onClick={onClick}
          fullWidth={true}
          startIcon={<CanvaIcon />}
          sx={{ mt: "auto" }}
        >
          Use template
        </DemoButton>
      )}
    </GenericCard>
  );
};

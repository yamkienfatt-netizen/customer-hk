import Typography from '../Typography/Typography';
import CTAButton from '../Button/CTAButton';
import ImageClipOnHover from '../Animation/ImageClipOnHover';
import RichTextTypography from '../Typography/RichTextTypography';
import ComponentError from '../Error/ComponentError';

type ArticleCardType = {
  legend: string;
  title: string;
  SubTitle: string;
  date: string;
  time: string;
  location: string;
  url: string;
  image: string;
  description?: string;
};

const EventListingCard = ({
  articleCard,
  cta,
  imgClassName,
  className,
}: {
  articleCard: ArticleCardType;
  cta?: { url: string; text: string };
  imgClassName?: string;
  className?: string;
}) => {
  try {
    return (
      <div className={className}>
        <div className="mb-[20px]">
          {articleCard.legend && (
            <Typography variant="l3" fontWeight="bold">
              {articleCard.legend}
            </Typography>
          )}
        </div>
        <div className="mb-[20px]">
          <a href={cta?.url}>
            <ImageClipOnHover
              src={articleCard.image}
              alt={`${articleCard.title} IMG`}
              className={imgClassName}
            />
          </a>
        </div>
        {articleCard.title && (
          <a href={cta?.url}>
            <div className="mb-[10px]">
              <Typography variant="h4">{articleCard.title}</Typography>
            </div>
          </a>
        )}
        {articleCard.description && (
          <>
            <div className="mt-[20px]" />
            <RichTextTypography>{articleCard.description}</RichTextTypography>
          </>
        )}
        {articleCard.SubTitle && (
          <div className="mb-[25px]">
            <Typography variant="p">{articleCard.SubTitle}</Typography>
          </div>
        )}
        <div className="mb-[25px]">
          {articleCard.date && articleCard.time && (
            <>
              <Typography variant="p" extraStyles="lg:hidden">
                {articleCard.date + ' | ' + articleCard.time}
              </Typography>
              <Typography variant="p" extraStyles="hidden lg:block">
                {articleCard.date}
              </Typography>
              <Typography variant="p" extraStyles="hidden lg:block">
                {articleCard.time}
              </Typography>
            </>
          )}
          {articleCard.location && (
            <div>
              <Typography variant="p">{articleCard.location}</Typography>
            </div>
          )}
        </div>
        {cta && <CTAButton url={cta.url} text={cta.text} variant="underlined" />}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default EventListingCard;

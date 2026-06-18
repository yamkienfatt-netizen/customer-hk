import React, { useRef, useState, JSX } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import PastEventListingCard from 'components/easthotels/Event/PastEventListingCard';
import Typography from 'components/easthotels/Typography/Typography';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ComponentRendering,
  GetServerSideComponentProps,
  useComponentProps,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { GetITWUTEventDetailsService } from '@/graphql/ITWUTEventDetailsQuery.service';
import { ComponentProps } from 'lib/component-props';
import {
  ItwutEventDetailsField,
  ItwutEventDetailsQueryProps,
} from '@/props/Graphql/ItwutEventDetailsQueryProps';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { GetSiteStartItemId } from '@/utilities/ContentUtilities';

export type PastEventListingProps = ComponentProps & {
  rendering: ComponentRendering;
};

const Dropdown = ({
  options,
  defaultValue,
  onChange,
}: {
  options: { key: string; value: string }[];
  defaultValue: string;
  onChange: (value: string) => void;
}) => {
  try {
    const [selectedOption, setSelectedOption] = useState(defaultValue);

    const handleOptionChange = (value: string) => {
      setSelectedOption(value);
      onChange(value);
    };

    return (
      <Select onValueChange={handleOptionChange} defaultValue={selectedOption}>
        {/* min-w-[140px] lg:min-w-[280px] */}
        <SelectTrigger className="w-full bg-inherit hover:outline-none focus-visible:outline-none">
          <Typography variant="l3" fontWeight="bold">
            <SelectValue>{selectedOption}</SelectValue>
          </Typography>
        </SelectTrigger>
        <SelectContent>
          {options.map(({ key, value }) => (
            <SelectItem
              key={key}
              value={value}
              className="bg-transparent px-2 py-1.5 underline-offset-4 hover:cursor-pointer hover:underline hover:decoration-2 hover:outline-none"
            >
              <Typography variant="p">{value}</Typography>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const Default = (pastEventListingProps: PastEventListingProps): JSX.Element => {
  try {
    const { t } = useI18n();
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const pastEventDetails = pastEventListingProps.rendering.uid
      ? (useComponentProps<Array<ItwutEventDetailsField>>(pastEventListingProps.rendering.uid))?.sort(
        // sort by date descending, the `eventDate` field is in ISO format
        (a, b) => (b.eventDate?.jsonValue?.value && a.eventDate?.jsonValue?.value)
          ? Date.parse(b.eventDate.jsonValue.value!) - Date.parse(a.eventDate.jsonValue.value!)
          : 0
      )
      : undefined;

    const sitecoreCss = pastEventListingProps.params?.Styles ?? '';
    const [filteredEvents, setFilteredEvents] = useState(pastEventDetails);
    const handleYearChange = (selectedYear: string) => {
      // Filter the events based on the selected year
      const filteredEvents =
        selectedYear === t(DICTIONARY_CONSTANT.FILTERING.ALL_YEAR)
          ? pastEventDetails
          : pastEventDetails?.filter((event) => {
            return event.ancestors[0]?.year.value === selectedYear;
          });
      setFilteredEvents(filteredEvents);
    };

    const handleLocationChange = (selectedLocation: string) => {
      // Handle location change logic here
      const filteredEvents =
        selectedLocation === t(DICTIONARY_CONSTANT.FILTERING.ALL_LOCATION)
          ? pastEventDetails
          : pastEventDetails?.filter((event) => {
            return event.legend.value === selectedLocation;
          });
      setFilteredEvents(filteredEvents);
    };

    const yearOptions = [
      {
        key: t(DICTIONARY_CONSTANT.FILTERING.ALL_YEAR),
        value: t(DICTIONARY_CONSTANT.FILTERING.ALL_YEAR),
      },
    ];

    const locationOptions = [
      {
        key: t(DICTIONARY_CONSTANT.FILTERING.ALL_LOCATION),
        value: t(DICTIONARY_CONSTANT.FILTERING.ALL_LOCATION),
      },
    ];

    const years: string[] = [];
    const locations: string[] = [];

    const sortedYear = [];
    pastEventDetails &&
      pastEventDetails.map((item, index) => {
        //Check if year value exists and does not exists in year option
        if (item.ancestors[0]?.year.value && !years.includes(item.ancestors[0]?.year.value)) {
          years.push(item.ancestors[0]?.year.value);
          sortedYear.push({
            key: item.ancestors[0]?.year.value,
            value: item.ancestors[0]?.year.value,
          });
        }

        if (item.legend.value && !locations.includes(item.legend.value as string)) {
          locations.push(item.legend.value as string);
          locationOptions.push({
            key: item.legend.value as string,
            value: item.legend.value as string,
          });
        }
      });

    sortedYear.sort(function (ele1, ele2) {
      if (ele1.key > ele2.key) return -1;
      if (ele1.key < ele2.key) return 1;
      return 0;
    });
    yearOptions.push(...sortedYear);

    return (
      <div
        className={
          'small-section-container !mt-[16px] flex w-full flex-col items-center justify-center lg:!mt-[60px]' +
          sitecoreCss
        }
      >
        <div className="w-full px-[15px] lg:flex lg:flex-col lg:items-center">
          <div className="flex w-full gap-[20px] lg:mb-[80px] lg:w-[45%] lg:justify-center">
            <Dropdown
              options={yearOptions}
              defaultValue={t(DICTIONARY_CONSTANT.FILTERING.ALL_YEAR)}
              onChange={handleYearChange}
            />
            {!pageFields.IsPropertyPage.value && !pageFields.IsPropertyInnerPage.value && (
              <Dropdown
                options={locationOptions}
                defaultValue={t(DICTIONARY_CONSTANT.FILTERING.ALL_LOCATION)}
                onChange={handleLocationChange}
              />
            )}
          </div>
          {filteredEvents &&
            filteredEvents.map((event, index) => (
              <div key={index} className="w-full">
                <PastEventListingCard articleCard={event} imageOnLeft={index % 2 === 1} />
              </div>
            ))}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const { route, context } = layoutData?.sitecore;
  const pageFields = route?.fields as PageRouteFields & _PageMetadata;

  var startItem = GetSiteStartItemId(context.itemPath);
  var fullEvents = await GetITWUTEventDetailsService(
    startItem,
    layoutData?.sitecore?.context?.language!,
    ''
  );

  const pastEventDetails = fullEvents?.filter((event) => {
    const parsedDate = Date.parse(event.eventDate.jsonValue.value! as string);
    return parsedDate < Date.now();
  });

  return pastEventDetails;
};

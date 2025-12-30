interface Props {
  locationLabel?: string;
  title?: string;
}

export const AbsoluteMapLabel = ({ locationLabel, title }: Props) => {
  let mainText = null;
  let subText = null;

  if (locationLabel) {
    const locationLabelParts = locationLabel
      .split(",")
      .map((item) => item.trim());

    if (locationLabelParts.length > 3) {
      // When address is complete, display place or street level / region
      const [, regionLevel, , placeLevel] = locationLabelParts.reverse();
      mainText = placeLevel;
      subText = regionLevel;
    } else if (locationLabelParts.length === 3) {
      const [streetLevel, regionLevel] = locationLabelParts;
      mainText = streetLevel;
      subText = regionLevel;
    } else if (locationLabelParts.length === 2) {
      const [regionLevel, countryLevel] = locationLabelParts;
      mainText = regionLevel;
      subText = countryLevel;
    } else {
      const [countryLevel] = locationLabelParts;
      mainText = countryLevel;
      subText = "";
    }
  }

  return (
    <div className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-start bg-linear-to-b from-transparent to-black/60 p-4">
      {(title || mainText) && (
        <span className="page-heading line-clamp-2 text-lg text-white!">
          {title || mainText}
        </span>
      )}

      {subText && <span className="text-white">{subText}</span>}
    </div>
  );
};

function LarrowIcon(props) {
  return (
    <svg
      className={props.className}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      role="img"
      width="24"
      height="24"
      fill="none"
      onClick={props.onClick}
    >
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="M15.525 18.966L8.558 12l6.967-6.967"
      ></path>
    </svg>
  );
}

export default LarrowIcon;

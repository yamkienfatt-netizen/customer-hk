const useArrow = (IsPropertyInnerPage: boolean, IsBrandInnerPage: boolean) => {
  let arrowColor = 'bg-green-primary';

  if (IsPropertyInnerPage === true) {
    arrowColor = 'bg-brown-secondary';
  } else if (IsBrandInnerPage === true) {
    arrowColor = 'bg-green-secondary';
  } else {
    arrowColor = 'bg-green-primary';
  }
  return { arrowColor };
};

export default useArrow;

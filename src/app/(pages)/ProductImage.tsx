const ProductImage = ({ imgURL }: { imgURL?: string }) => {
  return imgURL === undefined ? (
    <div>{`(No Product Image)`}</div>
  ) : (
    <img src={imgURL}></img>
  );
};

export default ProductImage;

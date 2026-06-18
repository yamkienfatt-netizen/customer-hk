import { LayoutServicePageState, useSitecoreContext } from "@sitecore-jss/sitecore-jss-nextjs";

const Default = ({error}:{error: any}) => {
    var errorMessage = JSON.stringify(error, Object.getOwnPropertyNames(error))
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit || sitecoreContext.pageState === LayoutServicePageState.Preview;
    console.log(error);
    return isPageEditing ? <p>Error Message: {errorMessage}</p> : <></>;
    //return <p>Error Message: {errorMessage}</p>;
};

export default Default;

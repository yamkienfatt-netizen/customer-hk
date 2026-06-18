import { LocationTemplateProps } from '@/props/Maps/LocationTemplateProps';
import { useEffect, useState } from 'react';
import ComponentError from '../Error/ComponentError';
import Script from 'next/script';

function AMapComponent(locationTemplateProps: LocationTemplateProps) {
  try {
    const [amapLoaded, setAmapLoaded] = useState(false);
    let map = null;

    useEffect(() => {
      if (typeof window !== 'undefined') {
        import('@amap/amap-jsapi-loader').then((AMapLoader) => {
          AMapLoader.load({
            key: locationTemplateProps.fields.GaodeKey.value as string,
            version: '2.0',
          }).then(() => {
            map = new AMap.Map('container', {
              // 设置地图容器id
              viewMode: '3D', // 是否为3D地图模式
              zoom: 18, // 初始化地图级别
              center: [
                locationTemplateProps.fields.GaodeLongitude.value as Number,
                locationTemplateProps.fields.GaodeLatitude.value as Number,
              ], // 初始化地图中心点位置
            });
            setAmapLoaded(true);
          });
        });
      }
    }, []);

    return (
      <>
        <Script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js" />
        <div className="amap-container" id="container" />
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
}
export default AMapComponent;

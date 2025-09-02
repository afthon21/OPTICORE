import styleLoad from './css/load.module.css'

export function LoadFragment() {
  return (
    <div className={`${styleLoad.spinner} ${styleLoad.center}`}>
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
      <div className={styleLoad['spinner-blade']} />
    </div>
  );
}
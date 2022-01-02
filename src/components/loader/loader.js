import loaderCss from './loader.module.css'
const Loader = () => {
    return (
        <div className={loaderCss.loaderparent}>
            <div className={loaderCss.loader}><div></div><div></div><div></div></div>
        </div>
    )
}
export default Loader;
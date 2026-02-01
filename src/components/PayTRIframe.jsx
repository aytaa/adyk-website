const PayTRIframe = ({ token }) => {
  if (!token) return null

  return (
    <div className="w-full min-h-[500px]">
      <iframe
        src={`https://www.paytr.com/odeme/guvenli/${token}`}
        frameBorder="0"
        className="w-full min-h-[500px] border-0 rounded-lg"
        allowFullScreen
      />
    </div>
  )
}

export default PayTRIframe

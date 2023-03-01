export type NftProps = {
    name: string,
    id: number
}

const Nft = ({ name, id }: NftProps) => {
  return (
    // style inlined to round borders
    <div
      className='nft'
      style={{
        width: '200px',
        height: '300px'
      }}
    >
      <div className='nft_inner'>
        <p>
          {name} NFT
        </p>
        <p>
          #{id}
        </p>
      </div>
    </div>
  )
}

export default Nft

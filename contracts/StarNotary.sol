pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 

    struct Star { 
        string name;
        string starStory;
        string ra;
        string dec;
        string mag;
    }
    bytes32 mtStarHash;

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => uint256) public coordinateToTokenId;

    constructor () public {
        mtStarHash = _starHash(Star("", "", "", "", ""));
    }

    event LogHash(bytes32 indexed _hash, string _description);
    event LogUint256(uint256 indexed _number, string _description);

    function _starHash(Star star) private pure returns (bytes32) {
        return keccak256(
            abi.encode(
                star.name,
                star.starStory,
                star.ra,
                star.dec,
                star.mag
            )
        );
    }

    function _coordinateHash(Star star) private pure returns (bytes32) {
        return _coordHash(star.ra, star.dec, star.mag);
    }

    function _coordHash(string _ra, string _dec, string _mag)
        private pure returns (bytes32) {
        return keccak256(abi.encode(_ra, _dec, _mag));
    }

    function createStar(
        string _name,
        string _starstory, 
        string _ra,
        string _dec,
        string _mag,
        uint256 _tokenId
    ) public { 
        Star storage star = tokenIdToStarInfo[_tokenId];
        bytes32 starHash = _starHash(star);
        require(starHash == mtStarHash, "tokenId for star already exists");
        
        Star memory newStar = Star(_name, _starstory, _ra,  _dec, _mag);
        
        bytes32 newStarCoordinateHash = _coordinateHash(newStar);
        uint256 tokenId = coordinateToTokenId[newStarCoordinateHash];
        emit LogHash(newStarCoordinateHash, "coordinate hash");
        emit LogUint256(tokenId, "tokenId");
        require(tokenId == 0, "star has coordinate duplicate");

        tokenIdToStarInfo[_tokenId] = newStar;
        coordinateToTokenId[newStarCoordinateHash] = _tokenId;
        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender, "must own star to sell it");
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0, "star not for sale");

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);

        require(msg.value >= starCost, "insufficent funds");

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }

    }

    function checkIfStarExist(string _ra, string _dec, string _mag) 
        public view returns (bool) {
        return coordinateToTokenId[_coordHash(_ra, _dec, _mag)] != 0;
    }

    function starIdToStarInfo(uint256 _token) 
        public view returns (string, string, string, string, string) {
        Star memory star = tokenIdToStarInfo[_token];
        return (star.name, star.starStory, star.ra, star.dec, star.mag);
    }

}

const ArchiveFile = require("./ArchiveFile");
const Util = require("./Util");

class ArchiveMember {
    /*
        Not quite an item, a member is the result of either a search query or the ITEMID_members.json file.
        It can point to an item.
        An array of these can sit in the members field of an item.
     */

    constructor(o) {
        // All this really does is turn o into an instance of class ArchiveMember
        //Handle weirdness in JSON where different type returned depending on none/1/many and possibly other weirdness
        ArchiveMember.processMetadataFjords(o); // Edit in place
        // And copy into initial fields
        Object.keys(o).map(k => this[k] = o[k]);
    }

    static processMetadataFjords(meta) {
        return Util.processMetadataFjords(meta);
    }

    thumbnailFile() {
        /*
        Return the thumbnailfile for a member, via its item,
        this should handle the case of whether the item has had metadata fetched or not, and must be synchronous as stored in <img src=> (the resolution is asyncronous)
         */
        //console.assert(this._list, "Should have loaded metadata which loads _list before calling thumbnailFile"); // Could also do here
        // New items should have __ia_thumb.jpg but older ones dont
        //TODO-REFACTOR-MEMBER there is no way this is going to work, its a placeholder for interactive debugging
        // noinspection JSUnresolvedVariable
        if (this.mediatype === "search") {
            throw new Error("Coding error - Saved searches dont have a thumbnail");
        }
        const metadata =  {
            format: "JPEG Thumb",
            name:   "__ia_thumb.jpg",
            // Could also set source:"original",rotation:"0",
        };
        const ipfs = this.thumbnaillinks && this.thumbnaillinks.find(f=>f.startsWith("ipfs:")); // Will be empty if no thumbnaillinks
        if (ipfs) metadata.ipfs = ipfs;
        const af = new ArchiveFile({itemid: this.identifier, metadata });
        return af;
    }

}
exports = module.exports = ArchiveMember;

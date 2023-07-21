import { AiOutlineClose } from 'react-icons/ai';
import styles from './style.module.css';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SetArrayofLinks,
  setShowGeneratedLinksPopup,
  setshowsProcessDetailPopup,
  SetProcessDetail,
  setDetailFetched,
  ProcessName,
  setLinksFetched,
} from '../../../../../../features/app/appSlice';

import React from 'react';

const GeneratedLinksModal = ({
  linksObj,
  masterLink,
  
  copiedLinks,
  updateCopiedLinks,
  handleCloseBtnClick,
}) => {
  const { ArrayofLinks, ProcessDetail } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { process_title, process_steps } = ProcessDetail;

  const [copiedStatus, setCopiedStatus] = useState(
    ArrayofLinks.map(() => false)
  );
  const handleCopyLink = (link) => {
    if (!link) return;

    navigator.clipboard.writeText(link);
    const currentCopiedLinks = structuredClone(copiedLinks);
    currentCopiedLinks.push(link);
    updateCopiedLinks(currentCopiedLinks);
    setTimeout(() => {
      updateCopiedLinks([]);
    }, 3000)
  };

  function handleProcessCopyLink(index, link) {
    navigator.clipboard.writeText(link);
    const newCopiedStatus = [...copiedStatus];
    newCopiedStatus[index] = true;
    setCopiedStatus(newCopiedStatus);
    setTimeout(() => {
      const newerCopiedStatus = [...copiedStatus];
      newerCopiedStatus[index] = false;
      setCopiedStatus(newerCopiedStatus);
    }, 1000);
  }
  function handleCloseDetailBtnClick() {
    dispatch(setshowsProcessDetailPopup(false));
  }



  ///////////
  return linksObj && typeof linksObj === 'object' ? (
    <div className={styles.process__Generated__Links__Overlay}>
      <div className={styles.process__Generated__Links__Container}>
        <div
          className={styles.process__Generated__Links__Container__Close__Icon}
          onClick={() => handleCloseBtnClick()}
        >
          <AiOutlineClose />
        </div>
        <div className={styles.process__Links__Wrapper}>
          <table>
            <thead>
              <tr>
                <td>S/No.</td>
                <td>Name</td>
                <td>Link</td>
                {linksObj.master_code ? <td>QR Code</td> : null}
                <td>Copy</td>
              </tr>
            </thead>

            <tbody className={styles.process__Links__Container}>
              {linksObj.master_link && typeof linksObj.master_link === 'string' ? (
                <>
                  <tr>
                    <td>0.</td>
                    {/* <td>{Object.keys(linksObj.master_link)}</td> */}
                    <td>Master Link</td>
                    <td
                      className={styles.single__Link}
                      onClick={() => handleCopyLink(linksObj.master_link)}
                    >
                      {linksObj.master_link}
                    </td>
                    <td>
                      {linksObj.master_code &&
                        typeof linksObj.master_code === 'string' ? (
                        <img
                          src={linksObj.master_code}
                          alt="qr code"
                          onClick={() => {
                            navigator.clipboard.writeText(linksObj.master_code);
                            toast.info("Copied to clipboard!");
                          }}
                        />

                      ) : (
                        <>Qr code</>
                      )}
                    </td>
                    <td>
                      <span
                        className={styles.process__Generated__Links__Copy__Item}
                        onClick={() => handleCopyLink(linksObj.master_link)}
                      >
                        {copiedLinks.includes(linksObj.master_link) ? 'Copied' : 'Copy'}
                      </span>
                    </td>
                  </tr>
                  {linksObj.links.map((link, index) => {
                    if (typeof link !== 'object') return null; // Skip non-object entries

                    const linkName = Object.keys(link)[0];
                    const linkValue = Object.values(link)[0];

                    return (
                      <tr key={index}>
                        <td>{index + 1}.</td>
                        <td>{linkName}</td>
                        <td
                          className={styles.single__Link}
                          onClick={() => handleCopyLink(linkValue)}
                        >
                          {linkValue}
                        </td>
                        <td>{null}</td>
                        <td>
                          <span
                            className={styles.process__Generated__Links__Copy__Item}
                            onClick={() => handleCopyLink(linkValue)}
                          >
                            {copiedLinks.includes(linkValue) ? 'Copied' : 'Copy'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                linksObj.links.map((link, index) => {
                  if (typeof link !== 'object') return null; // Skip non-object entries

                  const linkName = Object.keys(link)[0];
                  const linkValue = Object.values(link)[0];

                  return (
                    <tr key={index}>
                      <td>{index + 1}.</td>
                      <td>{linkName}</td>
                      <td
                        className={styles.single__Link}
                        onClick={() => handleCopyLink(linkValue)}
                      >
                        {linkValue}
                      </td>
                      <td>
                        <span
                          className={styles.process__Generated__Links__Copy__Item}
                          onClick={() => handleCopyLink(linkValue)}
                        >
                          {copiedLinks.includes(linkValue) ? 'Copied' : 'Copy'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  ) : (
    <div className={styles.process__Generated__Links__Overlay}>
      <div className={styles.process__Generated__Links__Container}>
        <div
          className={styles.process__Generated__Links__Container__Close__Icon}
          onClick={() => {
            dispatch(setShowGeneratedLinksPopup(false));
            dispatch(SetArrayofLinks([]));
            dispatch(setLinksFetched(false));
          }}
        >
          <AiOutlineClose />
        </div>
        <div className={styles.process__Links__Wrapper}>
          <table>
            <thead>
              <tr>
                <td>S/No.</td>
                <td>Name</td>
                <td>Link</td>
                <td>Copy</td>
              </tr>
            </thead>
            <tbody className={styles.process__Links__Container}>
              {ArrayofLinks.map((link, index) => {
                const linkName = Object.keys(link)[0];
                const linkUrl = Object.values(link)[0];
                const isCopied = copiedStatus[index];
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{linkName}</td>
                    <td className={styles.single__Link}>{linkUrl}</td>
                    <td>
                      <button
                        className={styles.process__Generated__Links__Copy__Item}
                        onClick={() => handleProcessCopyLink(index, linkUrl)}
                      >
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneratedLinksModal;
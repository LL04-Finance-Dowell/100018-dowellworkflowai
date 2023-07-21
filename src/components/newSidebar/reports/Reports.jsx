import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CollapseItem from '../collapseItem/CollapseItem';
import { v4 as uuidv4 } from 'uuid';
import sidebarStyles from '../sidebar.module.css';

import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  const [test, setTest] = useState(manageFileItems);
  const [itemsCountToDisplay, setItemsCountToDisplay] = useState({
    documents: { count: 0, countSet: false },
    workflows: { count: 0, countSet: false },
    templates: { count: 0, countSet: false },
    processes: { count: 0, countSet: false },
  });
  const { userDetail } = useSelector((state) => state.auth);

  const { allWorkflows: allWorkflowsArray } = useSelector(
    (state) => state.workflow
  );
  const { allTemplates: allTemplatesArray } = useSelector(
    (state) => state.template
  );
  const { allDocuments: allDocumentsArray } = useSelector(
    (state) => state.document
  );
  const { allProcesses, themeColor } = useSelector((state) => state.app);

  useEffect(() => {
    if (
      allDocumentsArray &&
      allDocumentsArray.length > 0 &&
      !itemsCountToDisplay.documents.countSet
    ) {
      const countOfDocuments = allDocumentsArray.filter(
        (item) =>
          item.document_state === 'draft' &&
          item.created_by === userDetail?.userinfo?.username
      ).length;
      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          documents: { count: countOfDocuments, countSet: true },
        };
      });
    }
    if (
      allTemplatesArray &&
      allTemplatesArray.length > 0 &&
      !itemsCountToDisplay.templates.countSet
    ) {
      const countOfTemplates = allTemplatesArray.filter(
        (item) => item.template_state === 'draft'
        // && item.created_by === userDetail?.userinfo.username
      ).length;
      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          templates: { count: countOfTemplates, countSet: true },
        };
      });
    }
    if (
      allWorkflowsArray &&
      allWorkflowsArray.length > 0 &&
      !itemsCountToDisplay.workflows.countSet
    ) {
      const countOfWorkflows = allWorkflowsArray.filter(
        (item) => item.created_by === userDetail?.userinfo.username
        // item.template_state === 'draft'
      ).length;
      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          workflows: { count: countOfWorkflows, countSet: true },
        };
      });
    }
    if (
      allProcesses &&
      allProcesses.length > 0 &&
      !itemsCountToDisplay.processes.countSet
    ) {
      const countOfProcesses =
        allProcesses.filter(
          (item) =>
            // item.created_by === userDetail?.userinfo.username
            item.processing_state === 'cancelled'
        ).length +
        allProcesses.filter((item) => item.processing_state === 'finalized')
          .length;

      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          processes: { count: countOfProcesses, countSet: true },
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDocumentsArray, allTemplatesArray, allWorkflowsArray, allProcesses]);

  useEffect(() => {
    setTest((prevItems) =>
      prevItems.map((item) =>
        item.parent.includes('My documents')
          ? {
              ...item,
              count:
                itemsCountToDisplay.documents.count > 0
                  ? itemsCountToDisplay.documents.count
                  : '00',
            }
          : item.parent.includes('My Templates')
          ? {
              ...item,
              count:
                itemsCountToDisplay.templates.count > 0
                  ? itemsCountToDisplay.templates.count
                  : '00',
            }
          : item.parent.includes('My Workflows')
          ? {
              ...item,
              count:
                itemsCountToDisplay.workflows.count > 0
                  ? itemsCountToDisplay.workflows.count
                  : '00',
            }
          : item.parent.includes('My Processes')
          ? {
              ...item,
              count:
                itemsCountToDisplay.processes.count > 0
                  ? itemsCountToDisplay.processes.count
                  : '00',
            }
          : item
      )
    );
  }, [itemsCountToDisplay]);

  return (
    <div className={sidebarStyles.feature__box}>
      <h2
        className={sidebarStyles.feature__title}
        style={{ color: themeColor }}
      >
        {t('Reports')}
      </h2>
      <CollapseItem items={test} />
    </div>
  );
};

export default Reports;

export const manageFileItems = [
  {
    id: uuidv4(),
    parent: 'My documents',
    // children: [

    //   { id: uuidv4(), child: 'All Documents', href: '/documents/#drafts' },
    //   { id: uuidv4(), child: 'Completed Documents', href: '/documents/completed' },
    // ],
    href: '/documents/completed',
  },
  // {
  //   id: uuidv4(),
  //   parent: 'My Templates',
  //   href: '/templates/#drafts',
  // },
  {
    id: uuidv4(),
    parent: 'My Workflows',
    href: '/workflows/#drafts',
  },
  {
    id: uuidv4(),
    parent: 'My Processes',
    href: '/processes/completed',
    // children: [
    //   {
    //     id: uuidv4(),
    //     child: 'Cancelled Processes',
    //     href: '/processes/cancelled',
    //   },
    //   { id: uuidv4(), child: 'Test Processes', href: '/processes/tests' },
    //   {
    //     id: uuidv4(),
    //     child: 'Completed Processes',
    //     href: '/processes/completed',
    //   },
    // ],
  },
];

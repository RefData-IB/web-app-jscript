import React, { Fragment, useEffect, useRef } from "react";
import MaterialTable from "material-table";
import http from "common/utils/httpClient";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import Observations from "common/components/Observations";
import { mapObservation } from "common/subjectModelMapper";
import { Typography, Table, TableBody, List, Box } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Link } from "react-router-dom";
import moment from "moment/moment";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const formatDate = aDate => (aDate ? moment(aDate).format("DD-MM-YYYY") : "-");

const transformApiResponse = response => {
  response.observations = mapObservation(response.observations);
};

const NewCompletedVisitsTable = ({ apiUrl, viewEncounterUrl, filterParams, entityUuid }) => {
  const { t } = useTranslation();
  const prev = usePrevious(filterParams);
  const columns = [
    {
      title: t("visitName"),
      field: "name",
      defaultSort: "asc",
      render: row => {
        const valueToDisplay = row.name ? t(row.name) : t(row.encounterType.name);
        return <Link to={`${viewEncounterUrl}?uuid=${row.uuid}`}>{valueToDisplay}</Link>;
      }
    },
    {
      title: t("visitcompleteddate"),
      field: "encounterDateTime",
      render: row => formatDate(row.encounterDateTime)
    },
    {
      title: t("visitscheduledate"),
      field: "earliestVisitDateTime",
      render: row => formatDate(row.earliestVisitDateTime)
    }
  ];

  const tableRef = React.createRef();
  const refreshTable = ref => ref.current && ref.current.onQueryChange();

  useEffect(() => {
    refreshTable(tableRef);
  });

  const fetchData = query =>
    new Promise(resolve => {
      const params = { ...filterParams };
      params.page = query.page;
      params.size = query.pageSize;
      if (!_.isEmpty(query.orderBy.field))
        params.sort = `${query.orderBy.field},${query.orderDirection}`;
      const filterQueryString = new URLSearchParams(params).toString();
      http
        .get(`${apiUrl}?${filterQueryString}`)
        .then(response => response.data)
        .then(result => {
          result.content.forEach(e => transformApiResponse(e));
          if (result.content.length === 0) {
            resolve({
              data: result.content,
              page: 0,
              totalCount: result.totalElements
            });
          } else {
            resolve({
              data: result.content,
              page: result.number,
              totalCount: result.totalElements
            });
          }
        })
        .catch(err => console.log(err));
    });

  return (
    <MaterialTable
      title=""
      components={{
        Container: props => <Fragment>{props.children}</Fragment>
      }}
      tableRef={tableRef}
      columns={columns}
      data={fetchData}
      options={{
        pageSize: 10,
        pageSizeOptions: [10, 15, 20],
        addRowPosition: "first",
        sorting: true,
        debounceInterval: 500,
        search: false,
        toolbar: false,
        detailPanelColumnAlignment: "right"
      }}
      detailPanel={[
        {
          icon: KeyboardArrowDownIcon,
          openIcon: KeyboardArrowUpIcon,
          render: row => {
            return (
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <List>
                      <Observations observations={row.observations ? row.observations : ""} />
                    </List>
                  </TableBody>
                </Table>
              </Box>
            );
          }
        }
      ]}
    />
  );
};

export default NewCompletedVisitsTable;
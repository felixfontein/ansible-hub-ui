import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { type CollectionVersionSearch } from 'src/api';
import {
  CollectionNumericLabel,
  CollectionRatings,
  DateComponent,
  DeprecatedTag,
  LabelGroup,
  Logo,
  RepositoryBadge,
  SignatureBadge,
  Tag,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { convertContentSummaryCounts, namespaceTitle } from 'src/utilities';
import './list-item.scss';

interface IProps {
  collection: CollectionVersionSearch;
  displaySignatures: boolean;
  dropdownMenu?: ReactNode | null;
  showNamespace?: boolean;
  synclistSwitch?: ReactNode | null;
  uploadButton?: ReactNode | null;
}

export const CollectionListItem = ({
  collection: {
    collection_version,
    namespace_metadata: namespace,
    repository,
    is_signed,
    is_deprecated,
  },
  displaySignatures,
  dropdownMenu,
  showNamespace,
  synclistSwitch,
  uploadButton,
}: IProps) => {
  const cells = [];

  const nsTitle = namespaceTitle(
    namespace || { name: collection_version.namespace },
  );

  if (showNamespace) {
    cells.push(
      <DataListCell isFilled={false} key='ns'>
        <Logo
          alt={t`${nsTitle} logo`}
          fallbackToDefault
          image={namespace?.avatar_url}
          size='130px'
          unlockWidth
          width='97px'
        />
      </DataListCell>,
    );
  }

  const contentSummary = convertContentSummaryCounts(collection_version);

  cells.push(
    <DataListCell key='content'>
      <div>
        <Link
          to={formatPath(Paths.collectionByRepo, {
            collection: collection_version.name,
            namespace: collection_version.namespace,
            repo: repository.name,
          })}
          data-cy='CollectionList-name'
        >
          {collection_version.name}
        </Link>
        {is_deprecated && <DeprecatedTag />}
        {showNamespace ? (
          <TextContent>
            <Text component={TextVariants.small}>
              <Trans>
                Provided by&nbsp;
                <Link
                  to={formatPath(Paths.namespaceDetail, {
                    namespace: collection_version.namespace,
                  })}
                >
                  {nsTitle}
                </Link>
              </Trans>
            </Text>
          </TextContent>
        ) : null}
      </div>
      <div className='hub-entry pf-v5-l-flex pf-m-wrap'>
        {Object.keys(contentSummary.contents).map((type) => (
          <div key={type}>
            <CollectionNumericLabel
              count={contentSummary.contents[type]}
              type={type}
            />
          </div>
        ))}
      </div>
      <div className='hub-entry pf-v5-l-flex pf-m-wrap'>
        <LabelGroup>
          {collection_version.tags.map((tag, index) => (
            <Tag key={index}>{tag.name}</Tag>
          ))}
        </LabelGroup>
      </div>
    </DataListCell>,
  );

  cells.push(
    <DataListCell isFilled={false} alignRight key='stats'>
      <Flex
        direction={{ default: 'column' }}
        alignItems={{ default: 'alignItemsFlexEnd' }}
      >
        <Flex
          direction={{ default: 'column' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
        >
          {synclistSwitch && <FlexItem>{synclistSwitch}</FlexItem>}
          {uploadButton || dropdownMenu ? (
            <FlexItem>
              {uploadButton}
              {dropdownMenu || <span className='hidden-menu-space' />}
            </FlexItem>
          ) : null}
          <FlexItem>
            <div>
              <Trans>
                Updated <DateComponent date={collection_version.pulp_created} />
              </Trans>
            </div>
            <div>v{collection_version.version}</div>
            <CollectionRatings
              isList
              namespace={collection_version.namespace}
              name={collection_version.name}
            />
          </FlexItem>
        </Flex>
        <Flex
          direction={{ default: 'row' }}
          alignSelf={{ default: 'alignSelfFlexStart' }}
        >
          <RepositoryBadge isFlexItem name={repository.name} />
          {displaySignatures ? (
            <FlexItem>
              <SignatureBadge
                variant='outline'
                signState={is_signed ? 'signed' : 'unsigned'}
              />
            </FlexItem>
          ) : null}
        </Flex>
      </Flex>
    </DataListCell>,
  );

  return (
    <DataListItem data-cy='CollectionListItem'>
      <DataListItemRow>
        <DataListItemCells dataListCells={cells} />
      </DataListItemRow>
    </DataListItem>
  );
};

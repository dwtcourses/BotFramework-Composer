// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AdaptiveFieldNames } from '../constants/AdaptiveFieldNames';
import { AdaptiveKinds } from '../constants/AdaptiveKinds';
import { IndexedNode } from '../models/IndexedNode';

const IfBranchKey = AdaptiveFieldNames.Actions;
const ElseBranchKey = AdaptiveFieldNames.ElseActions;

export function transformIfCondtion(
  input,
  jsonpath: string
): { condition: IndexedNode; choice: IndexedNode; ifGroup: IndexedNode; elseGroup: IndexedNode } | null {
  if (!input || input.$kind !== AdaptiveKinds.IfCondition) return null;

  const result = {
    condition: new IndexedNode(`${jsonpath}`, {
      ...input,
      $kind: AdaptiveKinds.ConditionNode,
    }),
    choice: new IndexedNode(`${jsonpath}`, {
      $kind: AdaptiveKinds.ChoiceDiamond,
      text: input.condition,
    }),
    ifGroup: new IndexedNode(`${jsonpath}.${IfBranchKey}`, {
      $kind: AdaptiveKinds.StepGroup,
      children: input[IfBranchKey] || [],
    }),
    elseGroup: new IndexedNode(`${jsonpath}.${ElseBranchKey}`, {
      $kind: AdaptiveKinds.StepGroup,
      children: input[ElseBranchKey] || [],
    }),
  };

  return result;
}
